# vim: ts=2:sts=2:sw=2:et:autoindent

def unpack: if type == "array" then .[] else . end;

def keyval_to_list:
  . # !object -> !string

  # Take an object and construct parameter list from it
  | to_entries 
  | [ 
    .[] 
    | select(.value)
    | . |
    if .value | type == "array" then 
      if .value | map(type == "string") | all | not then
        "Parameter values should be strings or arrays of strings (got \(.value))" | halt_error
      else
        (" \(.key)=\"\(.value | join(" "))\"") 
      end
    elif .value | type == "string" then
      (" \(.key)=\"\(.value)\"")
    elif .value == true then
      (" \(.key)")
    else
      empty
    end
  ]
  | join("")
  ;

def str($level):
  . # !string -> !object

  # add indention level information to a string
  | { level: $level, text: . }
  ;

def process($opts; $level):
  def itemprocess:
    if type == "string" then str($level+1)
    else process($opts; $level+1)
    end
    ;
  . # !object -> {text: !string, level: !integer}...

  # convert a node description and convert it into a stream
  # of strings 
  | .[$opts.type] as $type
  | .[$opts.items] as $items
  | .[$opts.extraArgs]? as $extraArgs
  | del(.[$opts.type], .[$opts.items], .[$opts.extraArgs])
  | ((. + $extraArgs) | keyval_to_list) as $keyval
  | $items
  | . |
  if $type | type == "string" | not then
    "Type value has to be of type string and can't be omited (got \($type) instead)" | halt_error
  elif ($type | startswith("!") ) then
    "<\($type)\($keyval)>" | str($level)
  elif . == null then
    "<\($type)\($keyval) />" | str($level)
  else
    ( "<\($type)\($keyval)>" | str($level) ), 
    ( unpack | itemprocess ), 
    ( "</\($type)>" | str($level) )
  end
  ;

def process($opts): process($opts; 0);

# Priority of options:
# - --arg CLI options with "-Key" suffix
# - --argjson object named "options", with "-Key" suffix
# - predefined default
def getOptions:
  def getFromArgs: $ARGS.named[.] // $ARGS.named.options[.];
  def getOption($key; $default; convert): (($key | getFromArgs) // $default) | convert;
  null # drop input immidiately
  | [ ( .
      | {type, extraArgs, items}
      | with_entries(.value = getOption(.key + "Key"; .value // .key; tostring))
    )
    , ( .
      | {indent: 4}
      | with_entries(.value = getOption(.key; .value; tonumber))
    )
  ]
  | add
  ;

def indent($whitespace):
  .
  | split("\n")
  | map($whitespace + .)
  | join("\n")
  ;

def main:
  . # (!object | [!object]) -> !string...
  | getOptions as $opts
  | unpack
  | process($opts)
  | (.level * $opts.indent * " ") as $wh
  | .text
  | indent($wh)
  ;

main

