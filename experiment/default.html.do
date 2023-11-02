exec >&2

src="$1.yml"

redo-ifchange "$src" json2html.jq

< "$src" yq --from-file preprocess.yq -oj | jq -f json2html.jq --arg typeKey tag -r > "$3"

