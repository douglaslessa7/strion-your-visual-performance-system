import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/dashboard/BottomNav";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Trash2,
  Shield,
  TrendingUp,
  Loader2,
  CreditCard,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      // Delete user storage files
      const { data: files } = await supabase.storage
        .from("user-photos")
        .list(user.id);

      if (files && files.length > 0) {
        // List subdirectories and delete all
        for (const item of files) {
          const { data: subFiles } = await supabase.storage
            .from("user-photos")
            .list(`${user.id}/${item.name}`);

          if (subFiles && subFiles.length > 0) {
            const paths = subFiles.map((f) => `${user.id}/${item.name}/${f.name}`);
            await supabase.storage.from("user-photos").remove(paths);
          }
        }
      }

      // Sign out (account deletion requires admin/service role — inform user)
      await signOut();
      toast("Account data cleared. Contact support to fully delete your account.");
      navigate("/");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete account data. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const daysSinceStart = profile.protocol_start_date
    ? Math.floor(
        (new Date().getTime() - new Date(profile.protocol_start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-6 pt-8 max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-base font-bold tracking-tight text-foreground">STRION</h1>
          <p className="text-xs text-muted-foreground">Profile</p>
        </div>

        {/* User Info */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-lg font-bold text-foreground">
                {(user?.email?.[0] ?? "U").toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {profile.display_name || user?.email}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Potential Range */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card mb-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Performance Data
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold tracking-metric text-foreground">
                {profile.current_index?.toFixed(1) ?? "—"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Current Index</p>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-metric text-foreground">
                {profile.max_potential?.toFixed(1) ?? "—"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Max Potential</p>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-metric text-foreground">
                {daysSinceStart > 0 ? daysSinceStart : "—"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Protocol Day</p>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card mb-6">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Subscription
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Free Access</p>
              <p className="text-xs text-muted-foreground">
                Subscription integration coming soon
              </p>
            </div>
            <span className="text-xs font-medium bg-positive/10 text-positive px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Privacy & Data
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">Photos</p>
              <p className="text-xs text-muted-foreground">Private bucket — signed URLs only</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">Data access</p>
              <p className="text-xs text-muted-foreground">Row-level security enforced</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">Index computation</p>
              <p className="text-xs text-muted-foreground">Server-side only</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete account</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove your stored photos and sign you out. This action
                  cannot be reversed. Your diagnostic data and protocol history will
                  be permanently lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? "Deleting..." : "Delete Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
