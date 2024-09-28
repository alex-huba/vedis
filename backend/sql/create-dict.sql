create table vedis.dictionary (
	id varchar(36) primary key,
	studentId varchar(36) not null,
	dueDate varchar(255) not null,
	word varchar(255) not null,
	transcription varchar(255) not null,
	translation varchar(255) not null
);