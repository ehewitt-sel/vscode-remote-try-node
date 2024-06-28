grammar SelLanguage

entry Model: (assignments+=Assignment)* (expected=Expected)?;

Assignment:
    Signal ('[' ind=IND ']')? ':=' value=Expr;

Signal: name=ID;

Expr: Add;
Add infers Expr:
    Mult ({infer BinExpr.e1=current} op=('+'|'-') e2=Mult)*;
Mult infers Expr:
    PrimExpr ({infer BinExpr.e1=current} op=('*'|'/') e2=PrimExpr)*;
PrimExpr: Ref | Lit;

Ref: Index | SignalRef | FuncInvoke;

Index: ind=IND;

SignalRef: (val=[Signal:ID]) ('[' expr=Expr ']')?;

FuncInvoke: (func=FUNC) '(' expr=Expr ')';

Lit: val=INT;

Expected: json=EXP;

terminal FUNC: /SIN|COS/;

terminal IND: /[nct]/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;

terminal EXP returns string: /\/\/=([^\n\r]+)/;
hidden terminal WS: /\s+/;
hidden terminal SINGLE_LINE_COMMENT: /\/\/[^\n\r]*/;


// hidden terminal SINGLE_LINE_COMMENT: /\/\/[^\n\r]*/;

// Assignment:
//     Signal ':=' value=Expr<false>;

// SampleIndexedAssignment:
//     Signal '[' Ind ']' ':=' value=Expr<true>;



// Signal:
//     name=ID;

// Expr<ind>: Add<ind>;
// Add<ind> infers Expr:
//     Mult<ind> ({infer BinExpr.e1=current} op=('+'|'-') e2=Mult<ind>)*;
// Mult<ind> infers Expr:
//     PrimExpr<ind> ({infer BinExpr.e1=current} op=('*'|'/') e2=PrimExpr<ind>)*;
// PrimExpr<ind>: (Ref<ind> | Lit | Group<ind> | NegExpr<ind>);
// Ref<ind>: (<ind> Ind) | SignalRef<ind>;
// SignalRef<ind>:
//     val=[Signal:ID] (<ind> '[' Expr<true> ']')?;
// Lit: val=INT;
// Group<ind>: '(' ge=Expr<ind> ')';
// NegExpr<ind>: '-' ne=Expr<ind>;

// terminal Ind: 'n';

// hidden terminal WS: /\s+/;
// terminal ID: /[_a-zA-Z][\w_]*/;
// terminal INT returns number: /[0-9]+/;
// //terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

// hidden terminal SINGLE_LINE_COMMENT: /\/\/[^\n\r]*/;
