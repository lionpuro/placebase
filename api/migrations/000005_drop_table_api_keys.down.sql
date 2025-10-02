create table if not exists api_keys (
	id         uuid not null default gen_random_uuid(),
	hash       text not null,
	name       text not null,
	user_id    text not null,
	created_at timestamp not null default (now() at time zone 'utc'),
	constraint pk_api_keys
		primary key (id),
	constraint uq_api_keys_hash
		unique (hash),
	constraint fk_api_keys_user_id
		foreign key (user_id)
		references users (id)
		on delete cascade
);
