
-- users table
CREATE TABLE users(
  user_id uuid DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  PRIMARY KEY(user_id)
);

-- contacts table
CREATE TABLE contacts(
  contact_id uuid DEFAULT uuid_generate_v4(),
  user_id UUID,
  contact_first_name VARCHAR(255) NOT NULL,
  contact_last_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  contact_number VARCHAR(255) NOT NULL,
  contact_favorite BOOLEAN DEFAULT false,
  PRIMARY KEY(contact_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);


INSERT INTO users (user_name, user_email, user_password) VALUES ('test', 'test@test.ch', 'test');

INSERT INTO contacts (user_id, contact_first_name, contact_last_name, contact_email, contact_number, contact_favorite) VALUES
 ('622ec6b0-e5f7-4346-aa21-a2f549b2e1cb', 'Konj', 'Konjevic', 'konj@test.ch', '+381601234568', false);

 SELECT * FROM users INNER JOIN contacts ON users.user_id = contacts.user_id;
