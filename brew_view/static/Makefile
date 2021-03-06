# Makefile for brew-view

MODULE_NAME   = brew_view
PYTHON_TEST_DIR = test/unit
JS_DIR = brew_view/static

.PHONY: clean clean-build clean-test help test deps
.DEFAULT_GOAL := help
define BROWSER_PYSCRIPT
import os, webbrowser, sys
try:
	from urllib import pathname2url
except:
	from urllib.request import pathname2url

webbrowser.open("file://" + pathname2url(os.path.abspath(sys.argv[1])))
endef
export BROWSER_PYSCRIPT

define PRINT_HELP_PYSCRIPT
import re, sys

for line in sys.stdin:
	match = re.match(r'^([a-zA-Z_-]+):.*?## (.*)$$', line)
	if match:
		target, help = match.groups()
		print("%-20s %s" % (target, help))
endef
export PRINT_HELP_PYSCRIPT
BROWSER := python -c "$$BROWSER_PYSCRIPT"


# Misc
help:
	@python -c "$$PRINT_HELP_PYSCRIPT" < $(MAKEFILE_LIST)

deps: ## install javascript dependencies
	yarn install


# Cleaning
clean-build: ## Remove dist
	rm -rf dist

clean-test: ## remove test and coverage artifacts
	echo "TODO: clean javascript tests"

clean-all: clean-build clean-test ## clean everything
	rm -f yarn-error.log

clean: clean-all ## alias of clean-all


# Linting
lint: ## check style with eslit
	yarn lint


# Testing / Coverage
test: ## run tests
	echo "TODO: run javascript tests"

coverage: ## check code coverage
	echo "TODO: run coverage reports"


# Packaging
package: ## builds distribution
	yarn build
