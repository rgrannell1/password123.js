
BIN        = ./node_modules/.bin





ESLINT       = $(BIN)/eslint
ESLINT_FLAGS = --config config/eslint





CODE_PATH = password123/



eslint:
	$(ESLINT) $(ESLINT_FLAGS) $(CODE_PATH)
