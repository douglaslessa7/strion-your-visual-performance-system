import { useEffect, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/dashboard/BottomNav";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PhotoSet {
  id: string;
  checkpoint_day: number;
  selfie_front_url: string | null;
  body_front_url: string | null;
  created_at: string;
}

interface IndexRecord {
  date: string;
  index_value: number;
  execution_component: number;
  visual_component: number;
  structural_component: number;
}

const CHECKPOINT_DAYS = [0, 14, 30, 60, 90];

const Progress = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [photoSets, setPhotoSets] = useState<PhotoSet[]>([]);
  const [indexHistory, setIndexHistory] = useState<IndexRecord[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [compareLeft, setCompareLeft] = useState<number>(0);
  const [compareRight, setCompareRight] = useState<number | null>(null);
  const [protocolStartDate, setProtocolStartDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);

      const [profileRes, photosRes, indexRes] = await Promise.all([
        supabase.from("profiles").select("protocol_start_date").eq("id", user.id).single(),
        supabase.from("photo_sets").select("id, checkpoint_day, selfie_front_url, body_front_url, created_at").eq("user_id", user.id).order("checkpoint_day", { ascending: true }),
        supabase.from("index_history").select("date, index_value, execution_component, visual_component, structural_component").eq("user_id", user.id).order("date", { ascending: true }),
      ]);

      if (profileRes.data) {
        setProtocolStartDate(profileRes.data.protocol_start_date);
      }

      if (photosRes.data) {
        setPhotoSets(photosRes.data);

        // Generate signed URLs for selfie_front photos
        const urlPromises: Promise<{ day: number; url: string } | null>[] = [];
        for (const ps of photosRes.data) {
          if (ps.selfie_front_url) {
            urlPromises.push(
              supabase.storage
                .from("user-photos")
                .createSignedUrl(ps.selfie_front_url, 3600)
                .then(({ data }) =>
                  data ? { day: ps.checkpoint_day, url: data.signedUrl } : null
                )
            );
          }
        }
        const results = await Promise.all(urlPromises);
        const urls: Record<string, string> = {};
        for (const r of results) {
          if (r) urls[r.day] = r.url;
        }
        setSignedUrls(urls);

        // Set compare right to latest checkpoint with photos
        if (photosRes.data.length > 1) {
          setCompareRight(photosRes.data[photosRes.data.length - 1].checkpoint_day);
        }
      }

      if (indexRes.data) {
        setIndexHistory(indexRes.data);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const currentDay = useMemo(() => {
    if (!protocolStartDate) return 0;
    const start = new Date(protocolStartDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, [protocolStartDate]);

  const availableCheckpoints = useMemo(() => {
    const days = new Set(photoSets.map((ps) => ps.checkpoint_day));
    return CHECKPOINT_DAYS.filter((d) => days.has(d));
  }, [photoSets]);

  const chartData = useMemo(() => {
    return indexHistory.map((r) => ({
      date: new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      Index: Number(r.index_value),
      Execution: Number(r.execution_component),
      Visual: Number(r.visual_component),
    }));
  }, [indexHistory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-6 pt-8 max-w-lg">
        <h1 className="text-base font-bold tracking-tight text-foreground mb-1">STRION</h1>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-8">
          Progress Timeline
        </p>

        {/* Timeline */}
        <div className="flex items-center justify-between mb-10 relative">
          {/* Connector line */}
          <div className="absolute top-5 left-5 right-5 h-px bg-border" />

          {CHECKPOINT_DAYS.map((day) => {
            const hasPhotos = photoSets.some((ps) => ps.checkpoint_day === day);
            const isReached = currentDay >= day;
            const thumbUrl = signedUrls[day];

            return (
              <div key={day} className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center overflow-hidden",
                    isReached
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  )}
                >
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={`Day ${day}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isReached ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {day}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground mt-2">
                  {day === 0 ? "Baseline" : `Day ${day}`}
                </span>
                {hasPhotos && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                )}
              </div>
            );
          })}
        </div>

        {/* Index Evolution Chart */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Index Evolution
          </p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  stroke="hsl(var(--border))"
                  domain={["dataMin - 5", "dataMax + 5"]}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "10px" }}
                />
                <Line
                  type="monotone"
                  dataKey="Index"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Execution"
                  stroke="hsl(var(--positive))"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="4 2"
                />
                <Line
                  type="monotone"
                  dataKey="Visual"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="4 2"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <p className="text-xs text-muted-foreground">Index data will appear as you progress.</p>
            </div>
          )}
        </div>

        {/* Side-by-Side Comparison */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-card">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Side-by-Side Comparison
          </p>

          {availableCheckpoints.length >= 1 ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <select
                  value={compareLeft}
                  onChange={(e) => setCompareLeft(Number(e.target.value))}
                  className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-xs text-foreground"
                >
                  {availableCheckpoints.map((d) => (
                    <option key={d} value={d}>
                      {d === 0 ? "Baseline" : `Day ${d}`}
                    </option>
                  ))}
                </select>
                <select
                  value={compareRight ?? ""}
                  onChange={(e) => setCompareRight(e.target.value ? Number(e.target.value) : null)}
                  className="bg-surface-elevated border border-border rounded-lg px-3 py-2 text-xs text-foreground"
                >
                  <option value="">Select...</option>
                  {availableCheckpoints
                    .filter((d) => d !== compareLeft)
                    .map((d) => (
                      <option key={d} value={d}>
                        {d === 0 ? "Baseline" : `Day ${d}`}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-[3/4] bg-background rounded-lg border border-border overflow-hidden flex items-center justify-center">
                  {signedUrls[compareLeft] ? (
                    <img
                      src={signedUrls[compareLeft]}
                      alt={`Day ${compareLeft}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {compareLeft === 0 ? "Baseline" : `Day ${compareLeft}`}
                    </span>
                  )}
                </div>
                <div className="aspect-[3/4] bg-background rounded-lg border border-border overflow-hidden flex items-center justify-center">
                  {compareRight !== null && signedUrls[compareRight] ? (
                    <img
                      src={signedUrls[compareRight]}
                      alt={`Day ${compareRight}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {compareRight !== null
                        ? compareRight === 0
                          ? "Baseline"
                          : `Day ${compareRight}`
                        : "Select checkpoint"}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] bg-background rounded-lg border border-border flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Day 0</span>
              </div>
              <div className="aspect-[3/4] bg-background rounded-lg border border-border flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Current</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Progress;
