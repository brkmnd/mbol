    var eval = function(source){
        var lexed = lexer(source);
        for(var i = 0; lexed[i] !== undefined; i++){
            //printfn(lexed[i].tt);
            }
        var parsed = parser(lexed);
        var evaled = traverseTree(printfn,parsed);
        };
