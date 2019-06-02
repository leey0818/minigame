import Room from '@/views/bingo/BingoRoom'
import RoomList from '@/views/bingo/BingoList'

const routes = [
  { path: '/bingo/list', component: RoomList },
  { path: '/bingo/:roomId', component: Room, props: true },
];

export default routes;