import Room from '@/games/bingo/Room'
import RoomList from '@/games/bingo/RoomList'

const routes = [
  { path: '/bingo/list', component: RoomList },
  { path: '/bingo/:id', component: Room },
];

export default routes;