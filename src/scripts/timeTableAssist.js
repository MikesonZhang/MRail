/**
 * 时刻表图表辅助js
 */


export const colorfulJudge = function(code){
  switch(code){
    case 'G':return '#fc5185';
    case 'D':return 'rgb(121,187,255)';
    case 'C':return 'rgb(121,187,255)';
    case 'Z':return '#48466d';
    case 'T':return '#dbe2ef';
    case 'K':return 'rgb(82,155,46)';
    case 'P':return '#444f5a';
    case 'S':return '#ea5455';
    case 'Y':return '#ea5455';
    default:return '#444f5a';
  }
}
