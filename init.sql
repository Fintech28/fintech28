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

-- loans table
create table loans (
    id serial primary key,
    byuserid integer,
    amount integer,
    senton timestamp
    default current_timestamp, 
    dueon timestamp default current_timestamp,
    isconfirmed boolean,
    interestrate integer,
    totalrepaid integer,
    isfullyrepaid boolean
);