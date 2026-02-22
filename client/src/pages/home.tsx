import { useState } from "react";
import { solve } from "@/lib/shamir";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, ShieldCheck, Terminal, Database, Code2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    secret: string;
    points: Array<{ x: number; y: string; base: number; rawValue: string }>;
  } | null>(null);
  const { toast } = useToast();

  const handleSolve = () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste your JSON data first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = solve(input);
      setResult(res);
      toast({
        title: "Success",
        description: "Polynomial evaluated successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Evaluation Failed",
        description: err.message || "Failed to process JSON. Check format.",
        variant: "destructive",
      });
    }
  };

  const loadExample = () => {
    const example = {
      "keys": {
        "n": 4,
        "k": 3
      },
      "1": {
        "base": "10",
        "value": "4"
      },
      "2": {
        "base": "2",
        "value": "111"
      },
      "3": {
        "base": "10",
        "value": "12"
      },
      "6": {
        "base": "4",
        "value": "213"
      }
    };
    setInput(JSON.stringify(example, null, 2));
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8 selection:bg-primary/30">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Header */}
        <header className="space-y-4 pt-8 pb-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-xl mb-4 border border-primary/20">
            <ShieldCheck className="w-6 h-6 text-primary mr-2" />
            <span className="font-mono text-sm font-medium tracking-tight">CRYPTOGRAPHIC_MODULE_V1</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter">
            Secret Recovery
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-light">
            Shamir's Secret Sharing solver. Paste your polynomial roots in JSON format to interpolate <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">f(0)</code>.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Card className="border-border/50 shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center font-mono text-base">
                    <Terminal className="w-4 h-4 mr-2 opacity-50" />
                    DATA_INPUT.json
                  </CardTitle>
                  <CardDescription>Enter test case payload</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={loadExample} className="font-mono text-xs h-8">
                  <Code2 className="w-3 h-3 mr-2" />
                  LOAD_EXAMPLE
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="{\n  &quot;keys&quot;: {\n    &quot;n&quot;: 4,\n    &quot;k&quot;: 3\n  },\n  ...\n}"
                  className="min-h-[400px] font-mono text-sm resize-y bg-background/50 focus-visible:ring-primary/20 p-4"
                  data-testid="input-json"
                />
                <Button 
                  onClick={handleSolve} 
                  className="w-full mt-6 h-12 text-base font-medium transition-all hover:scale-[1.02]"
                  data-testid="button-solve"
                >
                  <KeyRound className="w-5 h-5 mr-2" />
                  Execute Decryption
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="border-border/50 shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm h-full flex flex-col relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              
              <CardHeader>
                <CardTitle className="flex items-center font-mono text-base">
                  <Database className="w-4 h-4 mr-2 opacity-50" />
                  EVALUATION_RESULTS
                </CardTitle>
                <CardDescription>Parsed roots and computed secret</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {!result ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-xl p-8 min-h-[300px]">
                    <KeyRound className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-mono text-sm">AWAITING_PAYLOAD</p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                    
                    {/* Secret Output */}
                    <div className="space-y-3">
                      <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Calculated Secret f(0)</div>
                      <div 
                        className="bg-primary/10 border border-primary/20 rounded-xl p-6 relative overflow-hidden group"
                        data-testid="display-secret"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <div className="font-mono text-3xl md:text-4xl text-primary font-semibold break-all relative z-10">
                          {result.secret}
                        </div>
                      </div>
                    </div>

                    {/* Parsed Points */}
                    <div className="space-y-3">
                      <div className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                        <span>Decoded Roots</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded-md">{result.points.length} points</span>
                      </div>
                      <div className="grid gap-2 max-h-[250px] overflow-y-auto pr-2" data-testid="list-points">
                        {result.points.map((p, idx) => (
                          <div key={idx} className="flex items-center text-sm font-mono bg-muted/30 rounded-lg p-3 border border-border/50">
                            <div className="w-12 flex-shrink-0 text-muted-foreground border-r border-border/50 mr-3">
                              x: {p.x}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="truncate" title={p.y}>y: {p.y}</div>
                              <div className="text-xs text-muted-foreground/60 mt-1">
                                Base {p.base} (Raw: {p.rawValue})
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
