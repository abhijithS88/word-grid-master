#include <iostream>
#include <vector>
#include <fstream>

using namespace std;

int main(){
  fstream file("oldWords.txt", ios::in);
  string line;
  vector<string>newWords;
  while(!file.eof()){
    getline(file,line);
    if(line.length()>=4 and line.length()<=7){
      newWords.push_back(line);
    }
  }
  ofstream newfile("words.txt");
  for(string s : newWords){
    newfile << s <<endl;
  }
}