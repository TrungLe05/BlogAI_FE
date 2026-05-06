import { Edit3, Check, Bell } from "lucide-react";
import BrutalToggle from "./BrutalToggle";

interface ProfileSettingsFormProps {
  form: { fullName: string; email: string; avatarUrl: string };
  saved: boolean;
  onFormChange: (key: string, value: string) => void;
  onSave: () => void;
}

function ProfileSettingsForm({
  form,
  saved,
  onFormChange,
  onSave,
}: ProfileSettingsFormProps) {
  return (
    <div className="space-y-6" id="dash-edit-panel">
      {/* Profile Settings Form */}
      <div className="bg-white p-6 dark:bg-zinc-900 dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] border-[3px] border-[#0d0d0d]">
        <h2
          className="border-b-[3px] border-zinc-700 text-[#151d1e] font-black text-sm dark:text-white uppercase tracking-widest mb-5 flex items-center gap-2 pb-4"
          style={{
            fontFamily: "var(--font-display)",
            // borderBottom: "3px solid ",
            // color: "",
          }}
        >
          <Edit3 size={16} style={{ color: "#d32f2f" }} /> Profile Settings
        </h2>
        <div className="space-y-4">
          {[
            { label: "Display Name", key: "fullName", type: "text" },
            { label: "Email", key: "email", type: "text" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label
                className="block mb-2 text-xs dark:text-white text-[#5b403d] font-black uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {label}
              </label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => onFormChange(key, e.target.value)}
                className="dark:shadow-[4px_4px_0_#52525b] w-full px-4 py-3 text-sm outline-none transition-all border-[3px] border-[#0d0d0d] bg-white color-[#151d1e]"
                style={{
                  // border: "3px solid #0d0d0d",
                  // background: "#ffffff",
                  fontFamily: "var(--font-sans)",
                  // color: "#151d1e",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = "#e1eaeb";
                  e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.boxShadow = "none";
                }}
                disabled={(key as keyof typeof form) == "email" ? true : false}
              />
            </div>
          ))}
          <button
            onClick={onSave}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
            style={{
              fontFamily: "var(--font-display)",
              background: "#af101a",
              color: "white",
              border: "3px solid #0d0d0d",
              boxShadow: "4px 4px 0 #0d0d0d",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-4px,-4px)";
              e.currentTarget.style.boxShadow = "8px 8px 0 #0d0d0d";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0,0)";
              e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
            }}
          >
            {saved ? (
              <>
                <Check size={14} /> Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Account Section */}
      <div
        className="bg-white p-6 dark:bg-zinc-900 dark:border-zinc-600 dark:shadow-[4px_4px_0_#52525b] shadow-[4px_4px_0_#0d0d0d] border-[3px] border-[#0d0d0d]"
        // style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
      >
        <h2
          className="font-black text-sm uppercase widest mb-5 flex items-center gap-2 pb-4 dark:text-white text-[#151d1e] border-b-[3px] border-[#0d0d0d] dark:border-zinc-600"
          style={{
            fontFamily: "var(--font-display)",
            // borderBottom: "3px solid #0d0d0d",
            // color: "#151d1e",
          }}
        >
          <Bell size={16} style={{ color: "#d32f2f" }} /> Account
        </h2>
        <div
          className="p-4 mb-5 dark:bg-zinc-900 bg-[#ecf5f6] border-[3px] border-[#0d0d0d] dark:border-zinc-600"
          // style={{ background: "#ecf5f6", border: "3px solid #0d0d0d" }}
        >
          <p
            className="text-xs dark:text-white text-[#151d1e] font-black uppercase tracking-[0.15em] mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)"}}
          >
            <Bell size={13} /> Preferences
          </p>
          <BrutalToggle defaultOn label="Email Notifications" />
          <BrutalToggle defaultOn label="Post Likes" />
          <BrutalToggle defaultOn label="Comments" />
          <BrutalToggle label="Weekly Digest" />
        </div>
      </div>
    </div>
  );
}

export default ProfileSettingsForm;
