<template>
  <b-container fluid class="pt-2">
    <div>
      <h3 class="d-inline-block">생성된 방 목록</h3>
      <button class="btn btn-sm btn-outline-secondary float-right">방 생성</button>
    </div>
    <div style="max-width:560px">
      <b-table small bordered :fields="fields" :items="items" :busy.sync="loading">
        <template slot="index" slot-scope="data">
          {{ data.index + 1 }}
        </template>
        <template slot="title" slot-scope="data">
          <b-link :to="data.item.key">{{ data.value }}</b-link>
        </template>
        <template slot="count" slot-scope="data">
          {{ data.value }} 명
        </template>

        <div slot="table-busy" class="text-center">
          <span>목록을 불러오는 중 입니다...</span>
        </div>
      </b-table>
    </div>
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      fields: [
        {
          key: 'index',
          label: '번호',
          class: 'text-center',
          thStyle: {
            width: '50px',
          },
        },
        {
          key: 'title',
          label: '방 제목',
          thClass: 'text-center',
        },
        {
          key: 'count',
          label: '접속인원',
          class: 'text-right',
          thClass: 'text-center',
          thStyle: {
            width: '80px'
          },
        },
      ],
      items: [],
    };
  },
  sockets: {
    reconnect () {
      this.$socket.emit('list');
    },
    list (data) {
      this.loading = false;

      const rooms = data.rooms || [];
      this.items = rooms.map((room) => {
        return { key: room.id, title: room.title, count: room.curUser };
      });
    },
  },
  methods: {
    enterRoom () {
      console.log(arguments);
    },
  },
  created () {
    this.loading = true;
    this.$socket.emit('list');
  },
}
</script>
