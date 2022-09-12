SHELL := /bin/bash
PWD ?= pwd_unknown
THIS_FILE := $(lastword $(MAKEFILE_LIST))
export THIS_FILE

.PHONY: - help all
-: help
##	:
##all
all:app-web-build processor-build extension-essentials-build extension-hash-build
help:
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^//'
test:
##test
	npm run processor-build && npm run test -ws
##	:
app-web-build:
##app-web-build:
	npm run processor-build && npm run build -w @ciphereditor/app-web
##app-web-start:
app-web-start:
	npm run start -w @ciphereditor/app-web
##app-web-preview:
app-web-preview:
	npm run preview -w @ciphereditor/app-web
##	:
##app-desktop-start:
app-desktop-start:
	npm run start -w @ciphereditor/app-desktop
##app-desktop-pack:
app-desktop-pack:
	npm run pack -w @ciphereditor/app-desktop
##	:
##processor-build:
processor-build:
	npm run build -w @ciphereditor/processor
##processor-watch:
processor-watch:
	npm run watch -w @ciphereditor/processor
##	:
##extension-essentials-build:
extension-essentials-build:
	npm run build -w @ciphereditor/extension-essentials
##extension-essentials-watch:
extension-essentials-watch:
	npm run watch -w @ciphereditor/extension-essentials
##extension-hash-build:
extension-hash-build:
	npm run build -w @ciphereditor/extension-hash

