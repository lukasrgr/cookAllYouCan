CREATE TABLE recipe_manual (
    id int not null auto_increment primary key,
    recipe_id int not null,
    manual_data varchar(255) not null,
    steps int not null,
    CONSTRAINT `recipe_id` FOREIGN KEY (recipe_id) REFERENCES recipe (id) ON DELETE CASCADE ON UPDATE RESTRICT
);