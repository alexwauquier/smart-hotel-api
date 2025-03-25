CREATE TABLE "customer" (
	"id"                serial NOT NULL UNIQUE,
	"first_name"        varchar(40) NOT NULL,
	"last_name"         varchar(40) NOT NULL,
	"arrival_date"      date NOT NULL,
	"departure_date"    date NOT NULL,
	"space_id"          int NOT NULL,
	PRIMARY KEY ("id")
);


CREATE TABLE "employee" (
	"id"                serial NOT NULL UNIQUE,
	"first_name"        varchar(40) NOT NULL,
	"last_name"         varchar(40) NOT NULL,
	"username"          varchar(40) NOT NULL UNIQUE,
	"password_hash"     varchar(255) NOT NULL,
	"type_id"           char(2) NOT NULL,
	PRIMARY KEY ("id")
);


CREATE TABLE "employee_type" (
	"id"                char(2) NOT NULL UNIQUE,
	"label"             varchar(30) NOT NULL,
	PRIMARY KEY ("id")
);


CREATE TABLE "space" (
	"id"                serial NOT NULL UNIQUE,
	"name"              varchar(40) NOT NULL,
	"type_id"           char(2) NOT NULL,
	"capacity"          int,
	PRIMARY KEY ("id")
);


CREATE TABLE "space_type" (
	"id"                char(2) NOT NULL UNIQUE,
	"label"             varchar(30) NOT NULL,
	PRIMARY KEY ("id")
);


CREATE TABLE "order_header" (
	"id"                serial NOT NULL UNIQUE,
	"date"              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"customer_id"       int NOT NULL,
	"employee_id"       int,
	"status_id"         char(2) NOT NULL DEFAULT 'PE',
	"is_paid"           boolean NOT NULL DEFAULT false,
	PRIMARY KEY ("id")
);


CREATE TABLE "order_line" (
	"id"                serial NOT NULL UNIQUE,
	"order_header_id"   int NOT NULL,
	"product_id"        int NOT NULL,
	"product_quantity"  int NOT NULL,
	PRIMARY KEY ("id")
);


CREATE TABLE "order_status" (
	"id"                char(2) NOT NULL UNIQUE,
	"label"             varchar(30) NOT NULL,
	PRIMARY KEY ("id")
);


CREATE TABLE "product" (
	"id"                serial NOT NULL UNIQUE,
	"name"              varchar(40) NOT NULL,
	"description"       text,
	"ingredients"       text,
	"type_id"           char(2) NOT NULL,
	"contains_alcohol"  boolean NOT NULL,
	"unit_price"        decimal(5,2) NOT NULL,
	"stock_quantity"    int,
	"limit_quantity"    int,
	PRIMARY KEY ("id")
);


CREATE TABLE "product_type" (
	"id"                char(2) NOT NULL UNIQUE,
	"label"             varchar(30) NOT NULL,
	PRIMARY KEY ("id")
);


CREATE TABLE "sensor" (
	"id"                serial NOT NULL UNIQUE,
	"name"              varchar(40) NOT NULL,
	"type_id"           char(2) NOT NULL,
	"space_id"          int,
	PRIMARY KEY ("id")
);


CREATE TABLE "sensor_type" (
	"id"                char(2) NOT NULL UNIQUE,
	"label"             varchar(30) NOT NULL,
	PRIMARY KEY ("id")
);


CREATE TABLE "sensor_measurement" (
	"id"                serial NOT NULL UNIQUE,
	"sensor_id"         int NOT NULL,
	"value"             decimal(3,1) NOT NULL,
	"timestamp"         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY ("id")
);


ALTER TABLE "customer"
	ADD CONSTRAINT "fk_customer_space_id"
	FOREIGN KEY ("space_id") REFERENCES "space"("id")
	ON DELETE RESTRICT
	ON UPDATE CASCADE;

ALTER TABLE "employee"
    ADD CONSTRAINT "fk_employee_type_id"
	FOREIGN KEY ("type_id") REFERENCES "employee_type"("id")
	ON DELETE RESTRICT
    ON UPDATE CASCADE;

ALTER TABLE "space"
	ADD CONSTRAINT "fk_space_type_id"
	FOREIGN KEY ("type_id") REFERENCES "space_type"("id")
	ON DELETE RESTRICT
	ON UPDATE CASCADE;

ALTER TABLE "order_header"
	ADD CONSTRAINT "fk_order_header_customer_id"
	FOREIGN KEY ("customer_id") REFERENCES "customer"("id")
	ON DELETE RESTRICT
	ON UPDATE CASCADE;

ALTER TABLE "order_header"
	ADD CONSTRAINT "fk_order_header_employee_id"
	FOREIGN KEY ("employee_id") REFERENCES "employee"("id")
	ON DELETE RESTRICT
	ON UPDATE CASCADE;

ALTER TABLE "order_header"
	ADD CONSTRAINT "fk_order_header_status_id"
	FOREIGN KEY ("status_id") REFERENCES "order_status"("id")
	ON DELETE RESTRICT
	ON UPDATE CASCADE;

ALTER TABLE "order_line"
	ADD CONSTRAINT "fk_order_line_order_header_id"
	FOREIGN KEY ("order_header_id") REFERENCES "order_header"("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE;

ALTER TABLE "order_line"
	ADD CONSTRAINT "fk_order_line_product_id"
	FOREIGN KEY ("product_id") REFERENCES "product"("id")
	ON DELETE RESTRICT
	ON UPDATE CASCADE;

ALTER TABLE "product"
	ADD CONSTRAINT "fk_product_type_id"
	FOREIGN KEY ("type_id") REFERENCES "product_type"("id")
	ON DELETE RESTRICT
	ON UPDATE CASCADE;

ALTER TABLE "sensor"
	ADD CONSTRAINT "fk_sensor_type_id"
	FOREIGN KEY ("type_id") REFERENCES "sensor_type"("id")
	ON DELETE RESTRICT
	ON UPDATE CASCADE;

ALTER TABLE "sensor"
	ADD CONSTRAINT "fk_sensor_space_id"
	FOREIGN KEY ("space_id") REFERENCES "space"("id")
	ON DELETE SET NULL
	ON UPDATE CASCADE;

ALTER TABLE "sensor_measurement"
	ADD CONSTRAINT "fk_sensor_measurement_sensor_id"
	FOREIGN KEY ("sensor_id") REFERENCES "sensor"("id")
	ON DELETE CASCADE
	ON UPDATE CASCADE;

ALTER DATABASE smart_hotel_db SET timezone TO 'Europe/Madrid';
