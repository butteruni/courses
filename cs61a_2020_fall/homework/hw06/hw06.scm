(define (cddr s)
  (cdr (cdr s)))

(define (cadr s)
  'YOUR-CODE-HERE
  (car (cdr s))
)

(define (caddr s)
  'YOUR-CODE-HERE
  (car (cdr (cdr s)))
)


(define (sign num)
  'YOUR-CODE-HERE
(cond ( (= num 0) (print 0) )
        ( (> num 0) (print 1))
        ( else (print -1)))
)


(define (square x) (* x x))

(define (pow x y)
  'YOUR-CODE-HERE
  (cond ( (= y 1) x)
        ( (= y 0) 1)
        ( (= 0 (modulo y 2))
          (begin 
            (define temp (pow x (quotient y 2)))
            (* temp temp)
          )
        )
        ( (= 1 (modulo y 2))
          (begin 
            (define temp (pow x (quotient y 2)))
            (* temp temp x)
          )
        )
  )
)

