export default function MessageHandler(message){

    switch (message.type) {
        case 'reg':
          
          break;
        case 'update_winners':
          
          break;
        case 'create_room':
          
          break;
        case 'add_user_to_room':
          
          break;
        case 'update_room':
          
          break;
        case 'add_ships':
          
          break;
        case 'start_game':
          
          break;
        case 'attack':
          
          break;
        case 'randomAttack':
          
          break;
        case 'turn':
          
          break;
        case 'finish':
          
          break;
        default:
          return JSON.stringify({ error: 'Unknown request type' });
      }
}