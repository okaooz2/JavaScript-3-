(define (max-sum a b c) 
    (if (> a b) 
        (+ a (if (> b c)
            b 
            c)))
        (+ b (if (> a c)
            a 
            c))