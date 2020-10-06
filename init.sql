-- users table
 create table users (
     id serial primary key,
     name varchar(100),
     email varchar(100),
     phone varchar(50),
     password varchar(255),
     isverified boolean,
     balance integer
);

-- transactions table
 create table transactions (
     id serial primary key,
     byuserid integer,
     transactiontype varchar(50),
     amount integer,
     datetime timestamp
     default current_timestam
);