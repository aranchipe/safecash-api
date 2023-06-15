create database controle_financeiro

create table users (
    id serial primary key,
    name text not null,
    email text not null,
    password text not null
)

create table billings(
  id serial primary key,
  user_id integer not null references users(id),
  value numeric not null,
  data timestamp not null,
  description text not null,
  type text not null
)

create table guardados (
  id serial primary key,
  value numeric not null,
  month text not null,
  user_id integer not null references users(id)
)

create table dinheiro_atual (
  id serial primary key,
  value numeric not null,
  month text not null,
  user_id integer not null references users(id)
)