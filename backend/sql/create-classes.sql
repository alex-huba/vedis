create table vedis.classes (
	id varchar(36) primary key,
	cancelled boolean default false,
	studentId varchar(36) not null,
	`start` varchar(255) not null,
	`end` varchar(255) not null,
	price smallint not null,
	isPaid boolean default false
);