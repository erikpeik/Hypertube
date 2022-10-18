all: up

build: # Build all images
	docker-compose build

up: # Start all containers in the foreground
	docker-compose up

build-up: # Build and start all containers in the foreground
	docker-compose up --build

clean: # Remove all containers
	docker-compose down

fclean: # Remove all containers and images
	docker-compose down -v --rmi all

re: fclean build-up # Remove all containers and images and rebuild them

npm-back: # Install npm packages in the backend
	docker-compose exec server npm install

npm-front: # Install npm packages in the frontend
	docker-compose exec client npm install

.PHONY: all build up build-up clean fclean re
