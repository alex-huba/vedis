create table vedis.homework (
	id varchar(36) primary key,
	studentId varchar(36) not null,
	createdAt varchar(255) not null,
	dueDate varchar(255) not null,
	done boolean default false,
	content text not null
);