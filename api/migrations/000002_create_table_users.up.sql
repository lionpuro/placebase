create table if not exists users (
	id text primary key,
	created_at timestamp not null default (now() at time zone 'utc'),
	updated_at timestamp not null default (now() at time zone 'utc')
);
