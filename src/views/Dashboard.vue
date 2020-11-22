<template>
  <div>
    <a class="addTopicBtn" @click="addNotes()"
      ><b-icon-plus class="icon rounded-circle" variant="light"
    /></a>

    <a ref="button" class="saveTopicBtn" @click="saveNotes()"
      ><b-icon-cloud-arrow-up class="icon rounded-circle" variant="light"
    /></a>

    <b-overlay :show="loading" rounded="sm">
      <vue-draggable-resizable
        v-for="note in notes"
        :key="note.index"
        :style="{
          backgroundColor: note.color
        }"
        :x="note.position.x"
        :y="note.position.y"
        :w="note.position.width"
        :h="note.position.height"
        ref="dr"
        @dragging="onDragging(note.index)"
        @resizing="onResizing(note.index)"
      >
        <b-button
          variant="white"
          class="delbtn p-1"
          v-on:click="del(note.index)"
        >
          <b-icon-x-circle />
        </b-button>
        <b-button
          variant="white"
          class="editbtn p-1"
          v-on:click="editNotes(note.index)"
        >
          <b-icon-pencil />
        </b-button>
        <p class="textarea" :style="{ fontSize: note.fontSize }">
          {{ note.content }}
        </p>
      </vue-draggable-resizable>
    </b-overlay>

    <b-modal
      v-model="addModal.show"
      @hide="addModal.show = false"
      id="addModal"
      title="Add Notes"
    >
      <select
        class="custom-select custom-select-sm mb-2"
        style="width:auto; float: right; position: relative;"
        v-model="addModal.fontSize"
      >
        <option value="16px" selected="selected">16px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
      </select>
      <input
        class="mr-2 mb-1"
        type="color"
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

    <b-modal
      v-model="editModal.show"
      @hide="editModal.show = false"
      id="editModal"
      title="Edit Notes"
    >
      <select
        class="custom-select custom-select-sm mb-2"
        style="width:auto; float: right; position: relative;"
        v-model="editModal.fontSize"
      >
        <option value="16px" selected="selected">16px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
      </select>
      <input
        class="mr-2 mb-1"
        type="color"
        v-model="editModal.colorValue"
        style="float: right;"
      />
      <b-form-textarea
        id="textarea"
        v-model="editModal.content"
        placeholder="Enter something..."
        rows="3"
        max-rows="6"
      ></b-form-textarea>

      <template v-slot:modal-footer>
        <b-button size="sm" @click="hideEditModel()">Cancel</b-button>
        <b-button size="sm" variant="primary" @click="handleEdit()"
          >Edit Note</b-button
        >
      </template>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
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
    index: 0,
    addModal: {
      show: false,
      content: null,
      colorValue: "#FFFFFF",
      fontSize: "16px"
    },
    editModal: {
      show: false,
      content: null,
      colorValue: null,
      fontSize: null,
      index: null
    },
    loading: false
  }),
  mounted() {
    if (localStorage.notes != null) {
      this.notes = JSON.parse(localStorage.notes);
      console.log(this.notes);
    }
  },
  methods: {
    onDragging(index) {
      const bodyleft = this.$el.getBoundingClientRect().left;
      const bodytop = this.$el.getBoundingClientRect().top;

      const x = this.$refs.dr[index].$el.getBoundingClientRect().left;
      const y = this.$refs.dr[index].$el.getBoundingClientRect().top;

      this.notes[index].position.x = x - bodyleft;
      this.notes[index].position.y = y - bodytop;

      console.log(x);
      console.log(y);
    },
    onResizing(index) {
      const height = this.$refs.dr[index].$el.clientHeight;
      const width = this.$refs.dr[index].$el.clientWidth;
      this.notes[index].position.height = height;
      this.notes[index].position.width = width;
      console.log(height);
      console.log(width);
    },
    async saveNotes() {
      await axios
        .put("http://54.161.118.5:8080/api/memo", this.notes)
        .then(res => {
          console.log(note);
        })
        .catch(err => {
          console.log(err);
        });
    },
    del(index) {
      console.log(index);
      if (index > -1) {
        this.notes.splice(index, 1);
      }
      localStorage.notes = JSON.stringify(this.notes);
    },
    addNotes() {
      this.addModal.show = true;
    },
    editNotes(index) {
      this.editModal.show = true;
      this.editModal.content = this.notes[index].content;
      this.editModal.colorValue = this.notes[index].color;
      this.editModal.fontSize = this.notes[index].fontSize;
      this.editModal.index = index;
    },
    hideAddModel() {
      this.addModal.show = false;
    },
    hideEditModel() {
      this.editModal.show = false;
      this.editModal.show = false;
      this.editModal.content = null;
      this.editModal.colorValue = null;
      this.editModal.fontSize = null;
    },
    async handleAdd() {
      const defaultPosition = {
        height: 240,
        width: 240,
        top: 0,
        left: 0
      };

      const memoDetails = {
        memoID: this.notes.length,
        content: this.addModal.content,
        userID: "123213",
        color: this.addModal.colorValue,
        fontSize: this.addModal.fontSize,
        positionHeight: defaultPosition.height,
        positionWidth: defaultPosition.width,
        positionTop: defaultPosition.top,
        positionLeft: defaultPosition.left
      };
      await axios
        .post("http://54.161.118.5:8080/api/memo", memoDetails)
        .then(res => {
          console.log(res.data);
          const {
            memoID,
            content,
            color,
            font,
            height,
            width,
            top,
            left
          } = res.data;
          console.log(memoID);
          const note = {
            index: memoID,
            content: content,
            color: color,
            fontSize: font,
            position: {
              height: height,
              width: width,
              top: top,
              left: left
            }
          };
          console.log(note);
          this.notes.push(note);
          this.addModal.show = false;
        })
        .catch(err => {
          console.log(err);
        });
      this.addModal.content = null;
      this.addModal.colorValue = "#FFFFFF";
      this.addModal.fontSize = "16px";
    },
    handleEdit() {
      this.notes[this.editModal.index].content = this.editModal.content;
      this.notes[this.editModal.index].color = this.editModal.colorValue;
      this.notes[this.editModal.index].fontSize = this.editModal.fontSize;
      this.hideEditModel();
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

a.saveTopicBtn {
  position: fixed;
  font-size: 50px;
  right: 80px;
  bottom: 10px;
  z-index: 9;
}

a.saveTopicBtn .icon {
  background-color: #f1b200 !important;
  cursor: pointer;
}

a.addTopicBtn {
  position: fixed;
  font-size: 50px;
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
