<template>
  <div class="container mt-3">
    <b-overlay :show="loading" class="overlay">
      <vue-draggable-resizable
        v-for="(note, index) in notes"
        :key="index"
        :style="{
          backgroundColor: note.color,
          zIndex: Number(note.zIndex)
        }"
        :x="Number(note.positionLeft)"
        :y="Number(note.positionTop)"
        :w="Number(note.positionWidth)"
        :h="Number(note.positionHeight)"
        ref="dr"
        @dragging="onDragging(index)"
        @resizing="onResizing(index)"
        @activated="onActivate(index)"
      >
        <b-button variant="white" class="delbtn p-1" v-on:click="del(index)">
          <b-icon-x-circle />
        </b-button>
        <b-button
          variant="white"
          class="editbtn p-1"
          v-on:click="editNotes(index)"
        >
          <b-icon-pencil />
        </b-button>
        <p class="textarea" :style="{ fontSize: note.fontSize }">
          {{ note.content }}
        </p>
      </vue-draggable-resizable>

      <b-overlay :show="addLoading">
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
      </b-overlay>

      <b-overlay :show="editLoading">
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
      </b-overlay>

      <a class="addTopicBtn" @click="addNotes()"
        ><b-icon-plus class="icon rounded-circle" variant="light"
      /></a>

      <a ref="button" class="saveTopicBtn" @click="saveNotes()"
        ><b-icon-cloud-arrow-up class="icon rounded-circle" variant="light"
      /></a>
    </b-overlay>
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
    loading: false,
    addLoading: false,
    editLoading: false,
    zIndex: 99
  }),
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      await axios
        .get("http://54.161.118.5:8080/api/memo/" + "123")
        .then(res => {
          res.data.forEach(response => {
            const {
              memoID,
              userID,
              content,
              color,
              font,
              height,
              width,
              top,
              left,
              zIndex
            } = response;

            const note = {
              memoID: memoID,
              userID: userID,
              content: content,
              color: color,
              fontSize: font,
              positionHeight: height,
              positionWidth: width,
              positionTop: top,
              positionLeft: left,
              zIndex: zIndex
            };
            this.notes.push(note);
          });
          console.log(this.notes);
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    onDragging(index) {
      const bodyleft = this.$el.getBoundingClientRect().left;
      const bodytop = this.$el.getBoundingClientRect().top;

      const x = this.$refs.dr[index].$el.getBoundingClientRect().left;
      const y = this.$refs.dr[index].$el.getBoundingClientRect().top;

      this.notes[index].positionLeft = (x - bodyleft).toString();
      this.notes[index].positionTop = (y - bodytop).toString();
    },
    onResizing(index) {
      const height = this.$refs.dr[index].$el.clientHeight.toString();
      const width = this.$refs.dr[index].$el.clientWidth.toString();
      this.notes[index].positionHeight = height;
      this.notes[index].positionWidth = width;
    },
    onActivate(index) {
      console.log("activate");
      this.notes.forEach(note => {
        note.zIndex = "1";
      });
      this.notes[index].zIndex = "99";
    },
    async saveNotes() {
      this.loading = true;
      console.log(this.notes);
      await axios
        .put("http://54.161.118.5:8080/api/memo", this.notes)
        .then(res => {
          console.log(res);
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
      // localStorage.notes = JSON.stringify(this.notes);
    },
    async del(index) {
      this.loading = true;
      await axios
        .delete("http://54.161.118.5:8080/api/memo/" + this.notes[index].memoID)
        .then(res => {
          if (res) {
            console.log(this.notes);
          }
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
      this.notes = [];
      await this.getData();
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
      this.addLoading = true;
      const defaultPosition = {
        height: 240,
        width: 240,
        top: 0,
        left: 0,
        zIndex: 1
      };
      const memoDetails = {
        memoID: this.notes.length,
        content: this.addModal.content,
        userID: "123",
        color: this.addModal.colorValue,
        fontSize: this.addModal.fontSize,
        positionHeight: defaultPosition.height.toString(),
        positionWidth: defaultPosition.width.toString(),
        positionTop: defaultPosition.top.toString(),
        positionLeft: defaultPosition.left.toString(),
        zIndex: defaultPosition.zIndex.toString()
      };

      await axios
        .post("http://54.161.118.5:8080/api/memo", memoDetails)
        .then(res => {
          console.log(res.data);
          const {
            memoID,
            userID,
            content,
            color,
            font,
            height,
            width,
            top,
            left,
            zIndex
          } = res.data;

          console.log(memoID);

          const note = {
            memoID: memoID,
            userID: userID,
            content: content,
            color: color,
            fontSize: font,
            positionHeight: height.toString(),
            positionWidth: width.toString(),
            positionTop: top.toString(),
            positionLeft: left.toString(),
            zIndex: zIndex.toString()
          };
          console.log(note);
          this.notes.push(note);
          console.log(this.notes);
          this.addLoading = false;
          this.addModal.show = false;
        })
        .catch(err => {
          console.log(err);
          this.addLoading = false;
        });
      // this.notes.push(memoDetails);
      this.addModal.show = false;
      this.addModal.content = null;
      this.addModal.colorValue = "#FFFFFF";
      this.addModal.fontSize = "16px";
    },
    handleEdit() {
      const index = this.editModal.index;

      this.notes[index].content = this.editModal.content;
      this.notes[index].color = this.editModal.colorValue;
      this.notes[index].fontSize = this.editModal.fontSize;
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

.overlay {
  top: 20px;
  z-index: 999;
}

.fullsize {
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  position: fixed;
  background: green;
}
</style>
