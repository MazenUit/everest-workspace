CREATE TYPE locker_size AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

CREATE TABLE lockers (
  id VARCHAR(32) PRIMARY KEY,
  size locker_size NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE package_assignments (
  id SERIAL PRIMARY KEY,
  locker_id VARCHAR(32) NOT NULL REFERENCES lockers(id),
  pickup_code VARCHAR(16) NOT NULL UNIQUE,
  package_size locker_size NOT NULL,
  stored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  retrieved_at TIMESTAMPTZ
);
-- this for the index is for the query to find the smallest available locker
CREATE INDEX idx_lockers_available_size ON lockers (is_available, size);
-- this for the index is for the query to find the active package assignments
CREATE INDEX idx_assignments_active ON package_assignments (locker_id) WHERE retrieved_at IS NULL;