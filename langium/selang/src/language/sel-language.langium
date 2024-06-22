grammar SelLanguage

entry Model: (assignments+=Assignment)* (expected=Expected)?;

Assignment:
    Signal ('[' ind=Ind ']')? ':=' value=Expr;

Signal: name=ID;

Expr: Ref | Lit;

Ref: Ind | SignalRef;

SignalRef: (val=[Signal:ID]) '[' expr=Expr ']';

Lit: val=INT;

Expected: json=EXP;

terminal Ind: /[nct]/;
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
