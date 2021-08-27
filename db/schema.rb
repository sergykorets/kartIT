# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20210827091103) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "banners", force: :cascade do |t|
    t.datetime "next_race_date"
    t.string "circuit"
    t.string "register"
  end

  create_table "photos", force: :cascade do |t|
    t.string "picture_file_name"
    t.string "picture_content_type"
    t.integer "picture_file_size"
    t.datetime "picture_updated_at"
    t.string "picture_url"
    t.integer "race_id"
    t.string "comment"
  end

  create_table "race_standings", force: :cascade do |t|
    t.integer "place"
    t.integer "user_id"
    t.integer "race_id"
    t.string "name"
    t.string "company"
    t.string "specialization"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "qualify_group"
  end

  create_table "races", force: :cascade do |t|
    t.integer "number"
    t.integer "season"
    t.datetime "date"
    t.integer "track"
    t.integer "weather"
    t.decimal "best_lap"
    t.integer "best_lap_user_id"
    t.boolean "qualify_grouped", default: false
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "first_name", null: false
    t.integer "role", default: 0, null: false
    t.string "last_name", null: false
    t.string "company", null: false
    t.string "specialization", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "avatar_file_name"
    t.string "avatar_content_type"
    t.integer "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.string "provider"
    t.string "uid"
    t.string "remote_avatar_url"
    t.boolean "novice", default: true
    t.text "championships", default: [], array: true
    t.integer "pro_since"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
