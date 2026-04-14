COMMIT := $(shell git rev-parse --short=8 HEAD)
ZIP_FILENAME := $(or $(ZIP_FILENAME), $(shell echo "$${PWD\#\#*/}.zip"))
ZIP_FILENAME_JS := $(or $(ZIP_FILENAME_JS), naccjs.zip)
BUILD_DIR := $(or $(BUILD_DIR),"build")
VENDOR_AUTOLOAD := vendor/autoload.php

help:  ## Print the help documentation
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: nacc2
nacc2:  ## Build nacc2 JavaScript
	cd nacc2 && npm install && npm run build

.PHONY: build-js
build-js:  ## Build nacc2 JS-only zip (run make nacc2 first)
	zip -r ${ZIP_FILENAME_JS} nacc2/* -x "nacc2/node_modules/*" "nacc2/src/*" "nacc2/package.json" "nacc2/package-lock.json" "nacc2/vite.config.js"
	mkdir -p ${BUILD_DIR} && mv ${ZIP_FILENAME_JS} ${BUILD_DIR}/

.PHONY: build
build: build-js  ## Build WordPress plugin zip (run make nacc2 first)
	git archive --format=zip --output=${ZIP_FILENAME} $(COMMIT)
	mkdir -p ${BUILD_DIR} && mv ${ZIP_FILENAME} ${BUILD_DIR}/

.PHONY: all
all: nacc2 build  ## Build everything

.PHONY: clean
clean:  ## clean
	rm -rf build dist

$(VENDOR_AUTOLOAD):
	composer install --prefer-dist --no-progress

.PHONY: composer
composer: $(VENDOR_AUTOLOAD) ## Runs composer install

.PHONY: lint
lint: composer ## PHP Lint
	vendor/squizlabs/php_codesniffer/bin/phpcs

.PHONY: fmt
fmt: composer ## PHP Fmt
	vendor/squizlabs/php_codesniffer/bin/phpcbf

.PHONY: docs
docs:  ## Generate Docs
	docker run --rm -v $(shell pwd):/data phpdoc/phpdoc:3 --ignore=vendor/ --ignore=nacc2/ -d . -t docs/

.PHONY: dev
dev: ## Start dev compose
	docker compose up

.PHONY: mysql
mysql:  ## Runs mysql cli in mysql container
	docker exec -it nacc-db-1 mariadb -u root -psomewordpress wordpress

.PHONY: bash
bash:  ## Runs bash shell in wordpress container
	docker exec -it -w /var/www/html nacc-wordpress-1 bash
