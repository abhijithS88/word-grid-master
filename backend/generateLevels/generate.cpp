#include <bits/stdc++.h>
#include "json.hpp"
using namespace std;
using json = nlohmann::json;

#define int long long
#define double long double
#define endl '\n'
#define pb push_back
#define superSLOW ios_base::sync_with_stdio(false);cin.tie(NULL);cout.tie(NULL);
mt19937 rng((uint32_t)chrono::steady_clock::now().time_since_epoch().count());

struct value{
	int row;
	int col;
	char dir;
};

int level=1;
const int N=15,M=15;
vector<vector<char>>grid(N,vector<char>(M,'.'));
set<string>s;
vector<value>a[26];
bool isend[N][M],isstart[N][M];
char null='.';

void createjson(vector<string> &words , string &main){
	vector<vector<string>> result(grid.size(), vector<string>(grid[0].size()));
	for(int i=0;i<N;i++){
		for(int j=0;j<M;j++){
			result[i][j]=string(1,grid[i][j]);
		}
	}
	vector<vector<string>> given(grid.size(), vector<string>(grid[0].size()));
	for(int i=0;i<N;i++){
		for(int j=0;j<M;j++){
			if(grid[i][j]!='.')given[i][j]="#";
			else given[i][j]=".";
		}
	}
	vector<string>letters;
	for(char ch:main){
		string se(1,ch);
		letters.pb(se);
	}
	json doc{
		{"level",level},
	    {"grid",result},   
	    {"given",given},
	    {"letters",letters},
	    {"words",words}  
	};
  string name = "level"+to_string(level)+".json";
  fstream newfile("../levels/"+name, ios::out);
  newfile << doc;
}

bool bounded(int x , int y , int n , int m){
	if(x>=0 and y>=0 and x<n and y<m)return true;
	return false;
}

void init(){
	for(int i=0;i<N;i++){
		for(int j=0;j<N;j++){
			grid[i][j]=null;
			isend[i][j]=false;
			isstart[i][j]=false;
		}
	}
}

void print(){
	for(int i=0;i<N;i++){
		for(int j=0;j<N;j++){
			cout<<grid[i][j]<<" ";
		}
		cout<<endl;
	}
	cout<<endl;
}

void place(int x , int y , string &s , char dir){
	int xx=x,yy=y;
	for(int i=0;i<(int)s.length();i++){
		grid[xx][yy]=s[i];
		a[s[i]-'a'].pb(value{xx,yy,dir});
		if(i==0){
			isstart[xx][yy]=true;
		}
		if(i==(int)s.length()-1){
			isend[xx][yy]=true;
		}
		if(dir=='H'){
			yy++;
		}
		else xx++;
	}
}

bool tryy(int x , int y , string &s , char dir , int o){
	int n=s.length();
	if(dir=='H'){
		if(y+n-1>=M)return false;
		int yy=y;
		for(int i=0;i<n;i++){
			if(i==0){
				if(bounded(x,yy-1,N,M)){
					if(isend[x][yy])return false;
					if(grid[x][yy-1]!=null)return false;
				}
			}
			if(i==n-1){
				if(bounded(x,yy+1,N,M)){
					if(isstart[x][yy])return false;
					if(grid[x][yy+1]!=null)return false;
				}
			}
			if(i==o){
				yy++;
				continue;
			}
			if(bounded(x+1,yy,N,M)){
				if(grid[x+1][yy]!=null)return false;
			}
			if(bounded(x-1,yy,N,M)){
				if(grid[x-1][yy]!=null)return false;
			}
			if(bounded(x,yy,N,M)){
				if(grid[x][yy]!=null)return false;
			}
			else return false;
			yy++;
		}
	}
	else{
		if(x+n-1>=N)return false;
		int xx=x;
		for(int i=0;i<n;i++){
			if(i==0){
				if(bounded(xx-1,y,N,M)){
					if(isend[xx][y])return false;
					if(grid[xx-1][y]!=null)return false;
				}
			}
			if(i==n-1){
				if(bounded(xx+1,y,N,M)){
					if(isstart[xx][y])return false;
					if(grid[xx+1][y]!=null)return false;
				}
			}
			if(i==o){
				xx++;
				continue;
			}
			if(bounded(xx,y+1,N,M)){
				if(grid[xx][y+1]!=null)return false;
			}
			if(bounded(xx,y-1,N,M)){
				if(grid[xx][y-1]!=null)return false;
			}
			if(bounded(xx,y,N,M)){
				if(grid[xx][y]!=null)return false;
			}
			else return false;
			xx++;
		}
	}
	return true;
}

void generate(string str , vector<string> &v){
	int max=1;
	bool done=false;
	while(max--){
		init();
		for(int i=0;i<26;i++)a[i].clear();
		int cnt=1;
		place(4,4,str,'H');
		vector<string>used;
		used.pb(str);
		for(string p:v){
			for(int i=0;i<(int)p.length();i++){
				int f=0;
				for(value it:a[p[i]-'a']){
					int x=it.row,y=it.col;
					char d=it.dir;
					if(d=='H'){
						int nx=x-i ,ny=y ;
						char nd='V';
						if(tryy(nx,ny,p,nd,i)){
							place(nx,ny,p,nd);
							used.pb(p);
							f=1;
							break;
						}
					}
					else{
						int nx=x ,ny=y-i ;
						char nd='H';
						if(tryy(nx,ny,p,nd,i)){
							place(nx,ny,p,nd);
							used.pb(p);
							f=1;
							break;
						}
					}
				}
				if(f){
					cnt++;
					break;
				}
			}
			if(cnt>=12)break;
		}
		if(cnt>8){
			done=true;
			createjson(used,str);
			level++;
			break;
		}
	}
  // if(done)exit(0);
}

void create(string str){
	vector<string>v;
	int cnt[26]={0};
	for(char c:str){
		cnt[c-'a']++;
	}
	for(string str1:s){
		int f=1,cnt1[26]={0};
		for(char c:str1){
			cnt1[c-'a']++;
		}
		for(int i=0;i<26;i++){
			if(cnt1[i]>cnt[i])f=0;
		}
		if(f and str!=str1)v.pb(str1);
	}
	if(v.size()>=8)generate(str,v);
}

int32_t main() {
	superSLOW;
  fstream file("../wordsList/words.txt",ios::in);
	string str;
	while(getline(file,str)){
		s.insert(str);
	}
	vector<string>v;
	for(string str:s){
		if(str.length()==7 or str.length()==6){
			v.pb(str);
		}
	}
	shuffle(v.begin(),v.end(),rng);
	for(string s:v){
		create(s);
	}
	return 0;
}