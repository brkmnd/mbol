    var traverseTree = function(outf,treeStack){
        var exec = function(depth,tree){
            switch(tree.type){
                case "scope":
                    outf(depth,tree);
                    for(var i = 0; i < tree.lines.length; i++){
                        exec(depth+1,tree.lines[i]);
                        }
                    break;
                case "binding-type":
                    outf(depth,tree);
                    exec(depth+1,tree.args[0]);
                    break;
                case "binding":
                    var ids = function(){
                        var rval = "";
                        for(var i = 0; i < tree.id.length; i++){
                            rval += tree.id[i].v + ",";
                            }
                        return rval.substr(0,rval.length - 1);
                        }();
                    outf(int2spaces(depth)+"&lt;binding:"+ids+"&gt;");
                    for(var i = 0; i < tree.lines.length; i++){
                        exec(depth+1,tree.lines[i]);
                        }
                    break;
                case "type-plus":
                    outf(int2spaces(depth)+"&lt;type-plusr&gt;");
                    exec(depth+1,tree.args[0]);
                    exec(depth+1,tree.args[1]);
                    break;
                case "type-constr":
                    outf(int2spaces(depth)+"&lt;type-constr:"+tree.id+"&gt;");
                    exec(depth+1,tree.body);
                    break;
                case "type-constr-body":
                    exec(depth,tree.args[0]);
                    break;
                case "op-bin":
                    outf(int2spaces(depth)+"&lt;op-bin&gt;"+tree.v);
                    exec(depth+1,tree.args[0]);
                    exec(depth+1,tree.args[1]);
                    break;
                case "block":
                    outf(int2spaces(depth)+"&lt;block&gt;");
                    for(var i = 0; i < tree.lines.length; i++){
                        exec(depth+1,tree.lines[i]);
                        }
                    break;
                case "match":
                    outf(int2spaces(depth)+"&lt;match&gt;");
                    for(var i = 0; i < tree.cases.length; i++){
                        var c = tree.cases[i];
                        var cstr = "";
                        cstr += writeMatchLeft(c.mleft);
                        cstr += writeMatchWhen(c.mwhen);
                        outf(int2spaces(depth+1)+"&lt;case&gt;"+cstr);
                        exec(depth+2,c.mblock);
                        } 
                    break;
                case "atom-tuple":
                    outf(int2spaces(depth) + "&lt;tuple&gt;");
                    for(var i = 0; i < tree.args.length; i++){
                        exec(depth +1,tree.args[i]);
                        }
                    break;
                case "list":
                    outf(int2spaces(depth) + "&lt;list&gt;");
                    for(var i = 0; i < tree.args.length; i++){
                        outf(int2spaces(depth+1)+"&lt;item&gt;");
                        exec(depth+2,tree.args[i]);
                        }
                    break;
                case "array":
                    outf(int2spaces(depth) + "&lt;array&gt");
                    for(var i = 0; i < tree.args.length; i++){
                        outf(int2spaces(depth+1)+"&lt;item&gt;");
                        exec(depth+2,tree.args[i]);
                        }
                    break;
                case "indexing":
                    outf(int2spaces(depth)+"&lt;indexing&gt;");
                    exec(depth+1,tree.items);
                    exec(depth+1,tree.ind);
                    break;
                case "atom":
                    outf(int2spaces(depth)+"&lt;atom:"+tree.prgType+"&gt;"+tree.v);
                    break;
                default:
                    outf(int2spaces(depth)+"[default]"+tree.type);
                    break;
                }
            };
        exec(0,treeStack.pop());
        };
