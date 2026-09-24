-- Generate predefined teams for each district and age category
DO $$
DECLARE
  district_record RECORD;
  age_category_record RECORD;
  gender_val gender_category;
  team_name_val text;
BEGIN
  FOR district_record IN SELECT id, name FROM districts WHERE is_active = true LOOP
    FOR age_category_record IN SELECT id, name, short_name FROM age_categories WHERE is_active = true LOOP
      FOREACH gender_val IN ARRAY enum_range(NULL::gender_category) LOOP
        
        -- Formulate the team name (e.g., "Jabalpur Under-13 Men")
        team_name_val := district_record.name || ' ' || age_category_record.name || ' ' || gender_val;
        
        -- Insert if it doesn't already exist
        INSERT INTO teams (name, short_name, season, district_id, age_category_id, gender, is_active)
        VALUES (
          team_name_val,
          age_category_record.short_name || '-' || LEFT(gender_val::text, 1),
          '2026', -- Default season for now
          district_record.id,
          age_category_record.id,
          gender_val,
          true
        )
        ON CONFLICT (lower(trim(name)), season, district_id) WHERE is_active = true
        DO NOTHING;

      END LOOP;
    END LOOP;
  END LOOP;
END $$;
