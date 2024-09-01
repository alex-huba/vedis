create table vedis.classes (
	id varchar(36) primary key,
	status varchar(255) default "OK",
	studentId varchar(36) not null,
	title varchar(255) not null,
	`start` varchar(255) not null,
	`end` varchar(255) not null
);