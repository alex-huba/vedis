create table `posts` (
	id int not null auto_increment,
	title varchar(255) not null,
	body varchar(255) not null, 
	userId int not null, 
	createdAt timestamp not null default current_timestamp,
	primary key(`id`)
);