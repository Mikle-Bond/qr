exec >&2

src="$1.yml"

redo-ifchange "$src"

yq -oj < "$src" > "$3"

