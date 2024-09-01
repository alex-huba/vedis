create table vedis.homework (
	id varchar(36) primary key,
	studentId varchar(36) not null,
	date varchar(255) not null,
	status varchar(255) not null,
	content text not null
);