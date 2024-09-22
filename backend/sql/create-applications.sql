create table vedis.applications (
  id varchar(36) primary key,
  name varchar (255) not null,
  email varchar (255) unique not null,
  course varchar (255) not null, 
  phoneNumber varchar(255) unique not null,
  howToConnect varchar(255) not null,
  createdAt varchar(255) not null
);