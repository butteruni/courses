
t = int(input())
i = 1
while i <= t:
    i += 1
    n = int(input())
    if (n == 1 or n == 0):
        print(0)
    else:
        n -= 1
        ans = int(n * (n + 1) * 4)
        print(ans)
