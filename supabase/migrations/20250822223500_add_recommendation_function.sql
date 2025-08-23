-- Function to get recommended restaurants for a user
create or replace function get_recommended_restaurants(p_user_id uuid)
returns setof restaurants as $$
begin
  return query
  with top_cuisines as (
    -- 1. Find the user's most frequently ordered cuisine types
    select unnest(r.cuisine_types) as cuisine
    from orders o
    join restaurants r on o.restaurant_id = r.id
    where o.customer_id = p_user_id
    group by 1 -- group by cuisine
    order by count(*) desc
    limit 3
  ),
  ordered_restaurants as (
    -- 2. Get a list of restaurants the user has already ordered from
    select distinct o.restaurant_id from orders o where o.customer_id = p_user_id
  )
  -- 3. Find restaurants that match the top cuisines, haven't been ordered from, and are active
  select r.*
  from restaurants r
  where
    -- The exists clause checks if any of the restaurant's cuisine types are in the user's top cuisines
    exists (
      select 1
      from unnest(r.cuisine_types) as restaurant_cuisine
      where restaurant_cuisine in (select cuisine from top_cuisines)
    )
    and r.id not in (select restaurant_id from ordered_restaurants)
    and r.status = 'active'
  order by r.is_featured desc, r.rating desc
  limit 10;
end;
$$ language plpgsql;
