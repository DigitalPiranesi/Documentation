// TODO:
//   1. Write a command-line too for creating test manifests
//   2. Write a simple HTML interface for creating test manifests

const context_manager = require('./contexts/manager');

const flag_list = [
  {names: ["-c", "--context"], description: "Change the IIIF version context. Usage: -c VERSION_NUMBER. Must be included within the 'contexts' directory.", method: handleContextArgument},
  {names: ["-v", "--version"], description: "Display version information.", method: handleVersionArgument},
  {names: ["-h", "--help"], description: "Display program help information.", method: handleHelpArgument}
];

/**
 * Handle the invocation of "-c" or "--context" flags, providing context
 * switching.
 *
 * @param arguments An array of strings that are the program arguments.
 * @param index The index at which the context flag occured.
 */
function handleContextArgument(arguments, index){
  if(isNaN(arguments[index + 1])){
    console.error("Argument following context flag must be a version number.");
    return -1;
  }else{
    var version = new Number(arguments[index + 1]);
    var context = context_manager.switchContext(version);

    if(context != -1){
      console.log("Using context v" + version);
      return index + 1;
    }else {
      console.error("Failed to load specified context, version: " + version);
      return -1;
    }
  }
}

function handleVersionArgument(arguments, index){
  console.log("\nManifestGenerator v0.1 by Walter Pach.");
  console.log("See https://github.com/waltster/DigitalPiranesi for more information.\n");

  return index;
}

function handleHelpArgument(arguments, index){
  handleVersionArgument();

  for(const flag of flag_list){
    var names = flag.names.toString();

    console.log("  " + names + "\t: " + flag.description);
  }

  return index;
}

// Main function, executed by NodeJS.
(function(){
  let args = process.argv.splice(2);

  // Argument options:
  //   -c, --context : Set the current context version. Context must be available.
  for(var i = 0; i < args.length; i++){
    var found_flag = false;

    for(const flag of flag_list){
      if(flag.names.includes(args[i])){
        found_flag = true;
        i = (flag.method)(args, i);

        // If a flag handler errored, exit the program.
        if(i < 0){
          return;
        }
      }
    }

    if(!found_flag){
      console.error("Unrecognized option: '" + args[i] + "'. Use '-h' or '--help' for a list of arguments.");
      return;
    }
  }
})();
