<template>
  <div>
    <a class="addTopicBtn" @click="addNotes()"
      ><b-icon-plus class="icon rounded-circle" variant="light"
    /></a>

    <vue-draggable-resizable
      :w="240"
      :h="240"
      v-for="note in notes"
      :key="note.index"
      :style="{ backgroundColor: note.color }"
    >
      <b-button variant="white" class="delbtn p-1" v-on:click="del(note.index)">
        <b-icon-x-circle />
      </b-button>
      <b-button
        variant="white"
        class="editbtn p-1"
        v-on:click="edit(note.index)"
      >
        <b-icon-pencil />
      </b-button>
      <h5 class="textarea">{{ note.content }}</h5>
    </vue-draggable-resizable>

    <b-modal v-model="addModal.show" id="addModal" title="Add Notes">
      <input
        class="mb-2"
        type="color"
        id="favcolor"
        name="favcolor"
        value="#FFFFFF"
        v-model="addModal.colorValue"
        style="float: right;"
      />
      <b-form-textarea
        id="textarea"
        v-model="addModal.content"
        placeholder="Enter something..."
        rows="3"
        max-rows="6"
      ></b-form-textarea>

      <template v-slot:modal-footer>
        <b-button size="sm" @click="hideAddModel()">Cancel</b-button>
        <b-button size="sm" variant="primary" @click="handleAdd()"
          >Add Note</b-button
        >
      </template>
    </b-modal>
    <!-- <b-modal
      v-model="duptopic.modelShow"
      id="duptopic"
      :title="$t('createTopicForm.duptopic')"
      @hide="hideModel"
    >
      <template v-slot:modal-footer>
        <b-button size="sm" @click="hideModel()"> </b-button>
        <b-button size="sm" variant="primary" @click="handleOk()"> </b-button>
      </template>
    </b-modal> -->
  </div>
</template>

<script>
// import axios from "axios"
// import VueResizable from 'vue-resizable'
// import VueDragResize from "vue-drag-resize";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";

export default {
  components: {
    VueDraggableResizable
  },
  computed: {
    notesNum() {
      return this.notes.length;
    }
  },
  data: () => ({
    notes: [],
    addModal: {
      show: false,
      content: null,
      colorValue: "#FFFFFF"
    },
    showEditModal: false
  }),
  methods: {
    edit() {
      console.log("editing");
    },
    del(index) {
      console.log(index);
      if (index > -1) {
        this.notes.splice(index, 1);
      }
    },
    addNotes() {
      this.addModal.show = true;
    },
    hideAddModel() {
      this.addModal.show = false;
    },
    handleAdd() {
      const note = {
        content: this.addModal.content,
        index: this.notes.length,
        color: this.addModal.colorValue
      };
      this.notes.push(note);
      this.addModal.show = false;
      this.addModal.content = null;
    }
  }
};
</script>

<style>
.c-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: 0%;
  margin-left: -15px;
}

a.addTopicBtn {
  position: fixed;
  font-size: 40px;
  right: 10px;
  bottom: 10px;
  z-index: 9;
}
a.addTopicBtn .icon {
  background-color: #f1b200 !important;
  cursor: pointer;
}

.notes {
  margin: 10px 10px 10px 10px;
  height: 240px;
  width: 240px;
  z-index: 9;
}

.editbtn {
  margin-right: 1px;
  float: right;
  clear: left;
  z-index: 9;
}

.delbtn {
  margin-right: 1px;
  float: right;
  z-index: 9;
}

.textarea {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
