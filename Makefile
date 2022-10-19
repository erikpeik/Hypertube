# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: emende <emende@student.hive.fi>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/10/19 14:19:46 by emende            #+#    #+#              #
#    Updated: 2022/10/19 14:20:13 by emende.          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

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

npm-all: npm-back npm-front # Install npm packages in both backend and frontend

.PHONY: all build up build-up clean fclean re npm-back npm-front npm-all
