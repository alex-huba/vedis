create table vedis.classes (
	id varchar(36) primary key,
	isCancelled boolean default false,
	studentId varchar(36) not null,
	`start` datetime,
	`end` datetime,
	price smallint not null,
	isPaid boolean default false
);