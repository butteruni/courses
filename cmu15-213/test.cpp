#include <bits/stdc++.h>
#include <stdio.h>
typedef unsigned char *pointer;
typedef long long ll;
void show_bytes(pointer start,size_t len)
{
    size_t i;
    for(i = 0;i < len;++i)
    {
        printf("%p\t0x%.2x\n",start + i,start[i]);
    }
    printf("\n");
}
using namespace std;
float a = 1e10;
float b = 1e10,c = 3.14;
int main()
{
    ios::sync_with_stdio(0);
    cin.tie(0),cout.tie(0);
    // printf("int a = 15213;\n");
    // show_bytes((pointer)&a, sizeof(int));
    cout << ((a - b) + c) << endl;
    cout << 0xf << endl;

}