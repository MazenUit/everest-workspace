
## types.test.ts

Test	             Rule 
Same size            Small package in small locker OK
Larger locker        Prefer smallest fit — medium/large lockers accept smaller packages
Smaller locker       Cannot store oversized package

## allocator.test.ts

Test                         Rule 

Smallest that fits         Pick smallest free locker that fits 
No oversized locker        Don’t use L when M is free and enough 
Too big for all lockers    Return null — can’t store 
Skip busy lockers          Occupied lockers don’t count 
All fitting lockers busy   Return null — nothing available 


## pickup-code.test.ts

Test                  Rule
6 characters          Pickup code is short and readable
A–Z and 0–9 only      Avoid ambiguous symbols
Different each call   Codes should not repeat trivially


## retrieve-package.test.ts

Test                    Rule
Valid id + code         Package removed, locker available again
Wrong code              Invalid pickup
Unknown locker          Locker not found
Empty locker            Nothing to retrieve